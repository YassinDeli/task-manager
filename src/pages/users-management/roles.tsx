import Roles from "@/components/AdministrativeTools/UsersManagement/Roles/Roles";
import UserManagement from "@/components/AdministrativeTools/UsersManagement/UsersManagement";

export default function page() {
    return (
        <UserManagement>
            <Roles />
        </UserManagement>
    )
}