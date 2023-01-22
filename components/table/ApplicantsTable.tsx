"use client";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { memo } from "react";
import { IEmployeeRow, keyIEmployeeRow } from "./JobApplicationsTable";
import Accept from "./mutations/Accept";
import Reject from "./mutations/Reject";
import ScheduleInterview from "./mutations/ScheduleInterview";
import ViewDetails from "./mutations/ViewDetails";

export type Status =
  | "pending"
  | "accepted"
  | "rejected"
  | "Interview Scheduled";
type column = keyIEmployerRow[];
type keyIEmployerRow = keyof IEmployerRow;
export interface ITableBase {
  columns: column;
  jobId: string;
  className?: string;
}
export interface IEmployerRow {
  name: string;
  email: string;
  uid: string;
  date: string;
  status: Status;
  details: {
    resumeLink: string;
    coverLetter: string;
  };
  interviewDate?: string;
}

interface ITable extends ITableBase {
  dataRows: IEmployerRow[];
}

function ApplicantsTable({ dataRows, columns, jobId }: ITable) {
  if (isInvalidTable(dataRows, columns)) {
    if (dataRows.length !== 0)
      throw new Error("Table rows and columns must have the same length");
  }
  return (
    <TableContainer maxW={"fit-content"} mx="auto" p={"4"}>
      <Table size={"lg"} variant="simple" shadow={"md"}>
        <Thead bg={"brand.primary"} rounded={"2xl"}>
          <Tr>
            {columns.map((column) => (
              <Th
                paddingInline="3"
                textAlign={"center"}
                textColor={"white"}
                key={column}
              >
                {column}
              </Th>
            ))}
            <Th textColor={"white"}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataRows.length === 0 ? (
            <Tr>
              <Td
                colSpan={columns.length + 1}
                className="text-center capitalize"
              >
                No applicants yet
              </Td>
            </Tr>
          ) : (
            dataRows.map((row) => (
              <Tr key={row.uid}>
                {columns.map((column) => {
                  if (column !== "details")
                    return (
                      <Td
                        paddingInline="3"
                        textAlign={"center"}
                        key={row[column]}
                      >
                        {row[column]}
                      </Td>
                    );
                  else {
                    return (
                      <Td
                        key={crypto?.randomUUID.toString()}
                        paddingInline="3"
                        textAlign={"center"}
                      >
                        <ViewDetails
                          coverLetter={row.details.coverLetter}
                          resumeLink={row.details.resumeLink}
                          employeeName={row.name}
                          email={row.email}
                          uid={row.uid}
                        />
                      </Td>
                    );
                  }
                })}

                <Td className="flex items-center justify-center gap-2">
                  <Accept
                    jobId={jobId}
                    uid={row.uid}
                    email={row.email}
                    name={row.name}
                  />
                  <ScheduleInterview
                    jobId={jobId}
                    uid={row.uid}
                    email={row.email}
                    name={row.name}
                  />
                  <Reject
                    jobId={jobId}
                    uid={row.uid}
                    email={row.email}
                    name={row.name}
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default memo(ApplicantsTable);

export const isInvalidTable = (
  rows: IEmployerRow[] | IEmployeeRow[],
  columns: keyIEmployeeRow[] | keyIEmployerRow[]
): boolean => {
  // check if the all rows are valid and related columns

  const keys = Object.keys(rows) as keyIEmployeeRow[];
  return keys.every((key) => columns.indexOf(key as any) !== -1);
};
