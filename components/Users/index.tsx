import Image from "@/components/Image";

type UsersProps = {
    items: any[];
    className?: string;
    large?: boolean;
    border?: boolean;
};

const Users = ({ items, className, large, border }: UsersProps) => (
    <div className={`flex ${className}`}>
        <div className={`relative w-8 h-8 rounded-full overflow-hidden border-2 border-background dark:border-n-2`}>
            <Image src="/images/avatars/avatar.jpg" fill alt="Avatar" className="object-cover" />
        </div>
    </div>
);

export default Users;
