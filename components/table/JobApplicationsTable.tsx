import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { memo } from "react";
import useUser from "../../hooks/useUser";
import { isInvalidTable, Status } from "./ApplicantsTable";
import ViewDetails from "./mutations/ViewDetails";
import Withdraw from "./mutations/Withdraw";
export interface IEmployeeRow {
  company: string;
  jobPosting: string;
  jobTitle: string;
  interviewDate?: string;
  status: Status;
  details: {
    resumeLink: string;
    coverLetter: string;
    employeeName: string;
    email: string;
  };
}
export type keyIEmployeeRow = keyof IEmployeeRow;
type column = keyIEmployeeRow[];
interface ITable {
  dataRows: IEmployeeRow[];
  columns: column;
}

function JobApplicationsTable({ dataRows, columns }: ITable) {
  const { user } = useUser();
  if (isInvalidTable(dataRows, columns)) {
    if (dataRows.length !== 0)
      throw new Error("Table rows and columns must have the same length");
  }

  if (!user) return null;
  return (
    <TableContainer maxW={"container.2xl"} px={"16"} mx={"auto"}>
      <Table size={"lg"} variant="simple">
        <Thead bg={"brand.primary"} rounded={"2xl"}>
          <Tr>
            {columns.map((column) => (
              <Th textColor={"white"} key={column}>
                {column}
              </Th>
            ))}
            <Th textColor={"white"}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataRows.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length + 1} textAlign={"center"}>
                No applications yet
              </Td>
            </Tr>
          ) : (
            dataRows.map((row) => (
              <Tr key={row.jobPosting}>
                {columns.map((column) => {
                  if (column === "jobPosting") {
                    return (
                      <Td key={row[column]}>
                        <Link isExternal href={`/jobs/${row[column]}`}>
                          Visit <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                    );
                  }
                  if (column !== "details")
                    return <Td key={row[column]}>{row[column]}</Td>;
                  else {
                    return (
                      <Td key={crypto.randomUUID.toString()}>
                        <ViewDetails
                          coverLetter={row.details.coverLetter}
                          resumeLink={row.details.resumeLink}
                          employeeName={row.details.employeeName}
                          email={row.details.email}
                          uid={user.uid}
                        />
                      </Td>
                    );
                  }
                })}

                <Td>
                  {row.status !== "rejected" && (
                    <Withdraw jobId={row.jobPosting} uid={user.uid} />
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default memo(JobApplicationsTable);
