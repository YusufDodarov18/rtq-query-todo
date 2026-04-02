"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add, Edit, Delete, Info } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAddCategory,
  useDeleteCategory,
  useEditCategory,
  useGetGategories,
} from "@/hooks/useCategory";
import { category } from "@/app/types";

const categories = () => {
  const { data, error, isError, isLoading } = useGetGategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: addCategory } = useAddCategory();
  const { mutate: editCategory } = useEditCategory();
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [idx, setIdx] = useState<null | number>(null);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState<null | category>(null);

  const handleSubmit = () => {
    if (!name) {
      toast.error("please enter the name!");
      return;
    }
    addCategory(name);
    setName("");
  };

  const handleEditCategory = () => {
    if (editName.trim() == "" || idx == null) {
      toast.warn("please enter the new name!");
      setEditName("");
      return;
    } else {
      editCategory({ id: idx, name: editName });
      toast.info("category updated successfully", {
        autoClose: 2000,
      });
      setIdx(null);
      setEditName("");
    }
  };
  
  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          page create async-thunk-categories
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Добавить категорию
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="new categories"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Add />}
            >
              +add
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            edit categories
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="name categories"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <Button
              onClick={handleEditCategory}
              variant="outlined"
              startIcon={<Edit />}
            >
              save
            </Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>name</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>events</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((el) => (
                <TableRow key={el.id} hover>
                  <TableCell>{el.id}</TableCell>
                  <TableCell>{el.name}</TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title="info"
                      onClick={() => {
                        setModal(!modal);
                        setInfo(el);
                      }}
                    >
                      <IconButton color="primary">
                        <Info />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="edit">
                      <IconButton
                        onClick={() => {
                          setEditName(el.name);
                          setIdx(el.id);
                        }}
                        color="info"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="delete"
                      onClick={() => deleteCategory(el.id)}
                    >
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={modal} onClose={() => setModal(false)}>
          <DialogTitle>info categories</DialogTitle>
          <DialogContent dividers>
            <Typography>
              <strong>ID:</strong> {info?.id}
            </Typography>
            <Typography>
              <strong>name:</strong> {info?.name}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModal(false)}>close</Button>
          </DialogActions>
        </Dialog>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mt: 4 }}>
            error data: {error.message}
          </Alert>
        )}
      </Box>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default categories;
