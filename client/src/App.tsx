import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./theme"
import { Route, Routes } from "react-router-dom"
import Navbar from "@/scenes/navbar"
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions";
import { ToastContainer } from "react-toastify"
import RequireUser from "@/components/RequireUser"
import ProfilePage from "@/scenes/profile"
import AdminPage from "@/scenes/admin"
import UnauthorizePage from "@/scenes/unauthorize"
import EmailVerificationPage from "@/scenes/verifyemail"
import LoginPage from "@/scenes/login"
import RegisterPage from "@/scenes/register"

function App() {
  const theme = useMemo(() => createTheme(themeSettings), [])
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
          <Navbar />
          <Routes>
            <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
              <Route path='profile' element={<ProfilePage />} />
            </Route>
            <Route element={<RequireUser allowedRoles={['admin']} />}>
              <Route path='admin' element={<AdminPage />} />
            </Route>
            <Route path='unauthorized' element={<UnauthorizePage />} />
            
            <Route path='verifyemail' element={<EmailVerificationPage />}>
              <Route path=':verificationCode' element={<EmailVerificationPage />} />
            </Route>
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default App
