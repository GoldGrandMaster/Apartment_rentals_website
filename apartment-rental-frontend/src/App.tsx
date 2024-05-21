import { Navigate, Route, Routes } from "react-router-dom"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup/Signup"
import NotFound from "./pages/NotFound"
import AuthProvider from "./providers/AuthProvider"
import PrivateRoutes from "./layouts/PrivateRoutes"
import Apartment from "./pages/Apartment/Apartments"
import WithAppbar from "./layouts/WithAppbar"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/apartment" />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/apartment" element={<PrivateRoutes />}>
          <Route path="/apartment" element={<WithAppbar />}>
            <Route path="/apartment/" element={<Apartment />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
