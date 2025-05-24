// ... imports remain the same

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  allowedRoles = []
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Remove the admin route check since it's handled by routing

  // ... rest of the component remains the same
};

export default MainLayout;