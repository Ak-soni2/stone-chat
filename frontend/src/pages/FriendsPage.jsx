import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";

export default function FriendsPage() {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends?.length > 0 ? (
          friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-base-content/70">No friends found</p>
          </div>
        )}
      </div>
    </div>
  );
} 