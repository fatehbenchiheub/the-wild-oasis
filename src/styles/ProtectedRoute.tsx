type AppLayoutProps = React.PropsWithChildren;
function ProtectedRoute({ children }: AppLayoutProps) {
  return <div>{children}</div>;
}

export default ProtectedRoute;
