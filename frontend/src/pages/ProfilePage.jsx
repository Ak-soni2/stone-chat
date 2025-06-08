import { useThemeStore } from "../store/useThemeStore";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-8" data-theme={theme}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-200 rounded-lg shadow-lg p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{authUser?.fullName}</h1>
              <p className="text-base-content/70">@{authUser?.username}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Email</h2>
                <p className="text-base-content/70">{authUser?.email}</p>
              </div>
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Username</h2>
                <p className="text-base-content/70">{authUser?.username}</p>
              </div>
            </div>

            <div className="bg-base-300 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Bio</h2>
              <p className="text-base-content/70">
                {authUser?.bio || "No bio available"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Joined</h2>
                <p className="text-base-content/70">
                  {new Date(authUser?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Status</h2>
                <p className="text-success flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;