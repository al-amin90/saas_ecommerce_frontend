import React from "react";

interface Meta {
  total: number;
}

interface Props {
  name?: string;
  meta?: Meta;
}

const PageHeadingTitle: React.FC<Props> = ({ name = "Patients", meta }) => {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">
        {name}
      </h1>
      <p className="text-sm text-slate-400 mt-0.5">
        {meta?.total ?? 0} total {name} registered
      </p>
    </div>
  );
};

export default PageHeadingTitle;
