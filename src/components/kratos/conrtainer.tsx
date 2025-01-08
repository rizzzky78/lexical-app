import { FC, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const StreamContainer: FC<ContainerProps> = ({ children }) => {
  return (
    <div>
      <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
        {children}
      </div>
    </div>
  );
};
