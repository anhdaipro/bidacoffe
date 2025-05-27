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
        position: 0,
        cccdBack: '',
        cccdFront: '',
        avatar: '',
        bankId: 0,
        status:'',
        bankFullName: '',
        bankNo: '',
        baseSalary: 0,
    };
    return (
        <Form employee={employee} />
    );
}