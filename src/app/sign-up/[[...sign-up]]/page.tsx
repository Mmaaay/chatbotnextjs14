import { SignUp } from "@clerk/nextjs";

const page = ({}) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#0F172A",
          },
        }}
      />
    </div>
  );
};

export default page;
