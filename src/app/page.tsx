import { Box, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Добро пожаловать в Todo App Yusuf Dodarov!
      </Typography>

      <Typography variant="h5" color="text.secondary" gutterBottom>
        проекти todo asyncroni 14.06.2025
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
        <Link href={`/cattodo`}>
          <Button variant="contained" size="large">
            todo
          </Button>
        </Link>
        <Link href={"/catcategories"}>
          <Button variant="outlined" size="large">
            catigories
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
