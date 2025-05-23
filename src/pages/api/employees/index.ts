import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const employeeService = container.EmployeeService;
  try {
    switch (req.method) {
      case "GET": {
        const employees = await employeeService.getAllEmployees(req.query);
        return res.status(200).json(employees);
      }
      case "POST": {
        const employee = await employeeService.createEmployee(req.body);
        return res.status(200).json({
          message: "Employee Created Succssfully",
          code: 200,
          data: employee,
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
