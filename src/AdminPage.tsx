import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import styled from "styled-components";

const AdminContainer = styled.div`
  max-width: 40%;
  font-family: "CMU Serif", serif;
  color: #000;
  font-size: 0.8rem;
  padding-bottom: 50px;

  button {
    font-size: 0.7rem;
    padding: 2.5px;
    border: 0.75px solid #000;
    cursor: pointer;
  }
`;

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 8px;
  margin-bottom: 50px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.8rem;
  }

  input {
    padding: 5px;
    border: 1px solid #ccc;
    font-size: 0.8rem;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const PreviewBox = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeleteBadge = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  color: #000;
  border: none;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    color: #fff;
  }
`;

const ProjectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  &:hover {
    color: ${({ theme }) => theme.colors.garnetRed};
  }
`;

const AdminPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    thumbnail: "",
    mediaUrl: "",
  });

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error fetching projects:", error);
    else if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMultipleFilesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const newUploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-thumbnails")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("project-thumbnails")
          .getPublicUrl(filePath);
        newUploadedUrls.push(data.publicUrl);
      }

      setImageUrls((prev) => [...prev, ...newUploadedUrls]);
      if (!formData.thumbnail) {
        setFormData((prev) => ({ ...prev, thumbnail: newUploadedUrls[0] }));
      }
    } catch (error: any) {
      alert("이미지 업로드 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return alert("ID를 입력해주세요.");

    let mediaArray = [];
    if (formData.mediaUrl) {
      mediaArray = [{ type: "video", src: formData.mediaUrl }];
    } else {
      mediaArray = imageUrls.map((url) => ({ type: "image", src: url }));
    }

    const payload = {
      id: Number(formData.id),
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      media: mediaArray,
    };

    let error;
    if (editingId !== null) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      alert("작업 실패: " + error.message);
    } else {
      alert(editingId ? "수정 완료!" : "등록 완료!");
      resetForm();
      fetchProjects();
    }
  };

  const handleDelete = async (project: any) => {
    if (!project.id) return;
    if (
      !window.confirm(
        `${project.id}번 프로젝트와 연결된 모든 파일을 삭제할까요?`,
      )
    )
      return;

    try {
      const filesToDelete = project.media
        ?.filter((m: any) => m.type === "image")
        .map((m: any) => {
          const urlParts = m.src.split("/");
          return urlParts[urlParts.length - 1];
        });

      if (filesToDelete && filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("project-thumbnails")
          .remove(filesToDelete);

        if (storageError) {
          console.error("Storage 파일 삭제 중 일부 실패:", storageError);
        }
      }

      const { error: dbError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (dbError) throw dbError;

      alert("프로젝트와 관련 파일이 모두 삭제되었습니다.");
      fetchProjects();
    } catch (error: any) {
      alert("삭제 작업 중 에리 발생: " + error.message);
    }
  };

  const startEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      id: project.id.toString(),
      title: project.title,
      description: project.description || "",
      thumbnail: project.thumbnail || "",
      mediaUrl:
        project.media?.[0]?.type === "video" ? project.media[0].src : "",
    });
    const images =
      project.media
        ?.filter((m: any) => m.type === "image")
        .map((m: any) => m.src) || [];
    setImageUrls(images);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeImageFromServer = async (urlToRemove: string) => {
    if (
      !window.confirm(
        "이 이미지를 서버에서 영구 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)",
      )
    )
      return;

    try {
      setUploading(true);

      const urlParts = urlToRemove.split("/");
      const fileName = urlParts[urlParts.length - 1];

      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("project-thumbnails")
          .remove([fileName]);

        if (storageError) {
          throw new Error(`Storage 삭제 실패: ${storageError.message}`);
        }
      }

      const updatedUrls = imageUrls.filter((url) => url !== urlToRemove);
      setImageUrls(updatedUrls);

      if (formData.thumbnail === urlToRemove) {
        setFormData({ ...formData, thumbnail: updatedUrls[0] || "" });
      }

      alert("이미지가 서버에서 삭제되었습니다.");
    } catch (error: any) {
      console.error("이미지 삭제 에러:", error);
      alert("삭제 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      thumbnail: "",
      mediaUrl: "",
    });
    setImageUrls([]);
  };

  return (
    <AdminContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        <h1>
          <u>Admin Dashboard</u>
        </h1>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </div>

      <FormSection onSubmit={handleSubmit}>
        <h1 style={{ marginBottom: "20px" }}>
          {editingId ? `Editing Project ${editingId}` : "Upload New Project"}
        </h1>

        <InputGroup style={{ width: "150px" }}>
          <label>Project ID</label>
          <input
            type="number"
            placeholder="수동 입력, 클수록 상단"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
          />
        </InputGroup>

        <InputGroup>
          <label>Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleFilesUpload}
            disabled={uploading}
          />
          <ImagePreviewContainer>
            {imageUrls.map((url, i) => (
              <PreviewBox key={i} style={{ position: "relative" }}>
                {" "}
                <img src={url} alt="preview" />
                <DeleteBadge
                  type="button"
                  onClick={() => removeImageFromServer(url)}
                  disabled={uploading}
                  title="서버에서 영구 삭제"
                >
                  &times;
                </DeleteBadge>
              </PreviewBox>
            ))}
          </ImagePreviewContainer>
        </InputGroup>

        <InputGroup>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </InputGroup>

        <InputGroup>
          <label>Year</label>
          <input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </InputGroup>

        <InputGroup>
          <label>Vimeo Video URL</label>
          <input
            type="text"
            placeholder="(비워두면 이미지 프로젝트로 설정됨) https://player.vimeo.com/video/..."
            value={formData.mediaUrl}
            onChange={(e) =>
              setFormData({ ...formData, mediaUrl: e.target.value })
            }
          />
        </InputGroup>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={uploading}
            style={{
              padding: "5px",
              cursor: "pointer",
            }}
          >
            {editingId ? "UPDATE PROJECT" : "SAVE PROJECT"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ flex: 1, padding: "5px", cursor: "pointer" }}
            >
              CANCEL
            </button>
          )}
        </div>
      </FormSection>

      <hr
        style={{
          marginBottom: "30px",
          border: "0.25px solid",
        }}
      />

      <h1 style={{ marginBottom: "20px" }}>Project List ({projects.length})</h1>
      <div>
        {projects.map((p) => (
          <ProjectItem key={p.id}>
            <div>
              <span style={{ marginRight: "10px" }}>{p.id}</span>
              <span>{p.title}</span>
              <span>
                {p.category} ({p.description})
              </span>
            </div>
            <div>
              <button
                onClick={() => startEdit(p)}
                style={{ marginRight: "5px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(p)}>Delete</button>
            </div>
          </ProjectItem>
        ))}
      </div>
    </AdminContainer>
  );
};

export default AdminPage;
