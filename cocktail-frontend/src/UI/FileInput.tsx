import React, { useRef, useState } from "react";
import { Button, TextField } from "@mui/material";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
}

const FileInput: React.FC<Props> = ({ onChange, name, label }) => {
  const [filename, setFilename] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename("");
    }

    onChange(e);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="file"
        name={name}
        style={{ display: "none" }}
        ref={inputRef}
        onChange={onFileChange}
      />
      <TextField
        label={label}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        value={filename}
        onClick={activateInput}
        fullWidth
      />
      <Button variant="outlined" onClick={activateInput}>
        Browse
      </Button>
    </div>
  );
};

export default FileInput;