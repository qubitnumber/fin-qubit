import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme, Button, Tooltip, IconButton, Avatar } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import { useAppSelector } from '@/redux/store';
import { useLogoutUserMutation } from '@/redux/api/authApi';
import { errorToast } from '@/utils/toast';

const Navbar = () => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);
  const [logoutUser, { isLoading, isSuccess, error, isError }] =
  useLogoutUserMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }

    if (isError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Array.isArray((error as any).data.error)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).data.error.forEach((el: any) =>
        errorToast(el.message)
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorToast((error as any).data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onLogoutHandler = async () => {
    setSelected("logout")
    logoutUser();
    navigate('/');
  };

  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <PixIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="16px">
          Fin-Qubit
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        {user && (
          <>
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/dashboard"
              onClick={() => setSelected("dashboard")}
              style={{
                color: selected === "dashboard" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Dashboard
            </Link>
          </Box><Box sx={{ "&:hover": { color: palette.primary[100] } }}>
              <Link
                to="/predictions"
                onClick={() => setSelected("predictions")}
                style={{
                  color: selected === "predictions" ? "inherit" : palette.grey[700],
                  textDecoration: "inherit",
                }}
              >
                Predictions
              </Link>
          </Box>
          </>
        )}
        {!user && (
          <>
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/register"
              onClick={() => setSelected("register")}
              style={{
                color: selected === "register" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Signup
            </Link>
          </Box>
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
              <Link
                to="/login"
                onClick={() => setSelected("login")}
                style={{
                  color: selected === "login" ? "inherit" : palette.grey[700],
                  textDecoration: "inherit",
                }}
              >
                Login
              </Link>
            </Box>
            </>
        )}
        {user && (
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Button
              onClick={onLogoutHandler}
              style={{
                color: selected === "logout" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
                textTransform: 'none',
                fontSize: "0.8rem",
                marginLeft: "-1rem"
              }}
            >
              Logout
            </Button>
          </Box>
        )}
        {user && user?.role === 'admin' && (
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Link
              to="/admin"
              onClick={() => setSelected("admin")}
              style={{
                color: selected === "admin" ? "inherit" : palette.grey[700],
                textDecoration: "inherit",
              }}
            >
              Admin
            </Link>
          </Box>
        )}
        {user && (
          <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
            <Tooltip
              title='Post settings'
              onClick={() => navigate('/profile')}
            >
              <IconButton sx={{ p: 0 }}>
                <Avatar sx={{ width: 20, height: 20 }}>N</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;