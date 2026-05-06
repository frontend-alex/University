import React from "react";

const AccountLayout = ({
  children,
  video,
  position,
}: {
  children: React.ReactNode;
  video: string;
  position: "left" | "right";
}) => {
  return (
    <div className="grid-2-lg max-h-[100dvh]">
      {position === "left" ? <div className="min-h-screen flex-center">{children}</div> : ""}
      <div className="relative">
        <video
          src={video}
          autoPlay
          loop
          muted
          className="w-full max-h-[100dvh] hidden lg:flex object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/30" />
      </div>
      {position === "right" ? <div className="min-h-screen flex-center">{children}</div> : ""}
    </div>
  );
};

export default AccountLayout;
