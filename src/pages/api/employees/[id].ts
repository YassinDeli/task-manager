import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const employeeService = container.EmployeeService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const employee = await employeeService.getEmployeeById(Number(id));
        if (!employee) {
          return res
            .status(404)
            .json({ error: "Employee Not Found", code: 404 });
        }
        return res.status(200).json(employee);
      }
      case "PUT": {
        const updatedEmployee = await employeeService.updateEmployee(
          Number(id),
          req.body
        );
        return res.status(200).json({
          message: "Employee Updated Successfully",
          code: 200,
          data: updatedEmployee,
        });
      }
      case "DELETE": {
        await employeeService.deleteEmployee(Number(id));
        return res.status(200).json({
          message: "Employee Deleted Successfully",
          code: 200,
        });
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed", code: 405 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
