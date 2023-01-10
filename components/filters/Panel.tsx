import { Box, useColorModeValue } from "@chakra-ui/react";
import {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  ReactNode,
} from "react";

import { cx } from "./utils";

export type PanelProps = ComponentProps<"div"> &
  PropsWithChildren<{
    header?: string | ReactNode;
    footer?: string | ReactNode;
    classNames?: Partial<PanelClassNames>;
  }>;

export type PanelClassNames = {
  root: string;
  header: string;
  body: string;
  footer: string;
};

// eslint-disable-next-line react/display-name
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, header, footer, className, classNames = {}, ...props }, ref) => {
    const bgPanel = useColorModeValue("white", "gray.700");
    return (
      <div
        {...props}
        className={cx("  ais-Panel", classNames.root, className)}
        ref={ref}
      >
        {header && (
          <div className={cx("   ais-Panel-header", classNames.header)}>
            {header}
          </div>
        )}
        <Box
          as="div"
          bg={bgPanel}
          zIndex={49}
          shadow="md"
          className={cx(" ais-Panel-body", classNames.body)}
        >
          {children}
        </Box>
        {footer && (
          <Box
            as="div"
            bg={bgPanel}
            shadow="md"
            zIndex={50}
            className={cx("ais-Panel-footer", classNames.footer)}
          >
            {footer}
          </Box>
        )}
      </div>
    );
  }
);
