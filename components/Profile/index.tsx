import { useState, useRef, useEffect } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Field from "@/components/forms/Field";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthProvider";

const Profile = () => {
    const { session } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("/images/avatars/avatar.jpg");
    const [role, setRole] = useState("User");

    // Modal states
    const [editName, setEditName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user) {
            const meta = session.user.user_metadata || {};
            if (meta.full_name) setFullName(meta.full_name);
            if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
        }
    }, [session]);

    const handleOpenEdit = () => {
        setEditName(fullName);
        setIsEditing(true);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${session?.user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("profile-avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("profile-avatars")
                .getPublicUrl(filePath);

            // Optimistic update of UI
            const newUrl = data.publicUrl;
            setAvatarUrl(newUrl);

            // Persist
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: newUrl }
            });

            if (updateError) throw updateError;

            toast.success("Avatar updated successfully!");
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast.error(error.message || "Failed to upload avatar");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setSaving(true);
        const previousName = fullName;

        try {
            // Optimistic UI
            setFullName(editName);
            setIsEditing(false);

            const { error } = await supabase.auth.updateUser({
                data: { full_name: editName }
            });

            if (error) throw error;
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.message || "Failed to update profile");
            // Rollback
            setFullName(previousName);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="card text-center p-6">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full border-2 border-purple-1 flex items-center justify-center bg-n-2 dark:bg-n-6 group overflow-hidden">
                    {uploading ? (
                        <div className="w-6 h-6 rounded-full border-2 border-n-1 border-t-purple-1 animate-spin"></div>
                    ) : (
                        <>
                            <Image
                                src={avatarUrl || "/images/avatars/avatar.jpg"}
                                width={96}
                                height={96}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-n-7/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Icon name="camera" className="fill-white w-6 h-6" />
                            </button>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="text-h6">{fullName || session?.user?.email || "User"}</div>
                <div className="text-sm font-bold text-secondary mb-2">{session?.user?.email}</div>
                <button
                    className="btn-purple w-full mt-6"
                    onClick={handleOpenEdit}
                >
                    Edit Profile
                </button>
            </div>

            <Modal
                visible={isEditing}
                onClose={() => setIsEditing(false)}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-h6">Edit Profile</div>
                    </div>
                    <Field
                        className="mb-6"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={editName}
                        onChange={(e: any) => setEditName(e.target.value)}
                        required
                    />
                    <div className="flex gap-4">
                        <button
                            className="btn-stroke flex-1"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`btn-purple flex-1 ${saving ? "opacity-50 pointer-events-none" : ""}`}
                            onClick={handleSaveProfile}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Profile;
