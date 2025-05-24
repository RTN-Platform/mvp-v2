// ... other imports remain the same

function App() {
  return (
    <>
      <StorageInit />
      <Routes>
        {/* Main app routes with MainLayout */}
        {/* ... other routes remain the same ... */}

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/:id" element={<UserProfileView />} />
                <Route path="/content" element={<ContentManagement />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/messaging" element={<Messaging />} />
              </Routes>
            </AdminLayout>
          </RoleGuard>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;