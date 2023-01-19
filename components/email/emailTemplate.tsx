import { Container } from "@react-email/container";
import { Html } from "@react-email/html";

function emailTemplate({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <Html lang="en">
      <Container
        style={{
          margin: "auto",
          padding: "5px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            textAlign: "center",
            padding: "2rem",
            borderRadius: "0.25rem",
            border: "1px solid rgba(56,178,172,0.05)",
            color: "white",
            backgroundColor: "rgb(56,178,172)",
          }}
        >
          {title}
        </h1>
        <p style={{
          fontSize: "1.2rem",
        }}>{children}</p>
      </Container>
    </Html>
  );
}

export default emailTemplate;
