import Image from "@/components/Image";

const Profile = () => (
    <div className="card text-center p-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-1">
            <Image src="/images/avatars/avatar.jpg" width={96} height={96} alt="Avatar" className="object-cover" />
        </div>
        <div className="text-h6">Henry Richardson</div>
        <div className="text-sm font-bold text-secondary">Admin</div>
        <button className="btn-purple w-full mt-6">Edit Profile</button>
    </div>
);

export default Profile;
