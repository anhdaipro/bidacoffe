import Form from "@/app/conponent/employee/Form";
import { EmployeeForm } from "@/app/type/model/Employee";

const Create = () => {
    const employee = {
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        dateLeave: '',
        dateBeginJob: '',
        typeEducation: 0,
        cccdBack: '',
        cccdFront: '',
        roleId: 0,
        id:0,
        point: 0,
        avatar: '',
        bankId: 0,
        status:0,
        bankFullname: '',
        bankNo: '',
        baseSalary: 0,
    };
    return (
        <Form employee={employee} />
    );
}
export default Create;