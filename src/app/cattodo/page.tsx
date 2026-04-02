"use client";

import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import {
  useAddTodo,
  useCompletedTodo,
  useDeleteTodo,
  useEditTodo,
  useTodos,
} from "@/hooks/useTodos";
import { todo } from "../types";
import Image from "next/image";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CardTodo = () => {
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [idx, setIdx] = useState<null | number>(null);
  const [modal, setModal] = useState(false);
  const [modaladdImage, setModalAddImage] = useState(false);
  const [info, setInfo] = useState<null | todo>(null);
  const { data, isLoading, error, isError } = useTodos();
  const { mutate: addTodo, isPending: isAdding } = useAddTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: completedTodo } = useCompletedTodo();
  const { mutate: editTodo, isPending: isEditing } = useEditTodo();

  const handleToast = (message: string, type?: string) => {
    if (type === "error") {
      toast.error(message, { autoClose: 2000 });
    } else {
      toast.success(message, { autoClose: 2000 });
    }
  };

  const handleSubmit = () => {
    if (!name || !description || images.length == 0) {
      handleToast("Please fill out the form completely.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    images.forEach((file) => formData.append("Images", file));

    try {
      addTodo(formData);
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      handleToast("Error adding todo", "error");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (!files) return;
    setImages(Array.from(files));
  };

  const handleEditTodo = () => {
    if (!editName || !editDescription || !idx) {
      handleToast("Please fill out the form completely.", "error");
    } else {
      editTodo({
        newData: {
          name: editName,
          description: editDescription,
          id: idx,
        },
      });
      setIdx(null);
      setEditName("");
      setEditDescription("");
    }
  };

  return (
    <div className="flex flex-col px-10 py-10">
      <Typography variant="h4">page create-async-thunk-todo</Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          mt: 6,
          alignItems: "stretch",
          justifyContent: "start",
          flexWrap: "wrap",
        }}
      >
        <TextField
          onChange={(e) => setName(e.target.value)}
          label="Name"
          value={name}
          variant="outlined"
        />
        <TextField
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          variant="outlined"
        />

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ marginTop: "15px" }}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
        <Button disabled={isAdding} variant="contained" onClick={handleSubmit}>
          Add Todo
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          onChange={(e) => setEditName(e.target.value)}
          label="Edit Name"
          value={editName || ""}
          variant="outlined"
        />
        <TextField
          onChange={(e) => setEditDescription(e.target.value)}
          label="Edit Description"
          variant="outlined"
          value={editDescription || ""}
        />
        <Button variant="contained" onClick={handleEditTodo}>
          <EditIcon />
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((el) => (
              <TableRow key={el.id}>
                <TableCell>
                  {el.isCompleted ? el.name : <del>{el.name}</del>}
                </TableCell>
                <TableCell>
                  {el.isCompleted ? (
                    el.description
                  ) : (
                    <del>{el.description}</del>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    color: el.isCompleted ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {el.isCompleted ? "Completed" : "Inactive"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => deleteTodo(el.id)}
                    >
                      <AutoDeleteIcon />
                    </Button>
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => completedTodo(el.id)}
                    >
                      {el.isCompleted ? (
                        <CheckCircleOutlineIcon />
                      ) : (
                        <CloseIcon />
                      )}
                    </Button>
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setEditName(el.name);
                        setEditDescription(el.description);
                        setIdx(el.id);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      color="info"
                      size="small"
                      onClick={() => {
                        setModal(!modal);
                        setInfo(el);
                      }}
                    >
                      <InfoIcon />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        toast.warning("this todo already has image", {
                          autoClose: 2000,
                        });
                        setModalAddImage(!modaladdImage);
                      }}
                    >
                      <ImageIcon />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isLoading && (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />
      )}

      {isError && <h3 style={{ textAlign: "center" }}>An error occurred!</h3>}

      {modal && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              p: 4,
              backgroundColor: "white",
              minWidth: 200,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Image
              src={`https://to-dos-api.softclub.tj/images/${info?.images?.[0]?.imageName}`}
              alt="todo image"
              width={100}
              height={100}
              className="object-cover"
            />
            <p>{info?.id}</p>
            <b>{info?.name}</b>
            <b>{info?.description}</b>
            <Button
              onClick={() => setModal(false)}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </div>
      )}

      {modaladdImage && (
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "550px",
            backgroundColor: "skyblue",
            padding: "50px",
            borderRadius: "21px",
          }}
        >
          <form>
            <input name="Images" type="file" style={{ marginBottom: "20px" }} />
            <Button type="submit" variant="contained" sx={{ marginRight: 1 }}>
              Add Image
            </Button>
            <Button variant="outlined" type="submit">
              Cancel
            </Button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CardTodo;
