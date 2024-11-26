import { Check } from "@mui/icons-material";
import { LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { WidgetProps } from "@rjsf/utils";
import { FC, useEffect, useState } from "react";
import uploadFile from "../../utils/uploadFile";
import { toast } from "../../utils/toast";
import getErrorMessage from "../../utils/getErrorMessage";

type Props = {
  progress?: number;
};
const FileUploadTextWidget: FC<Partial<WidgetProps> & Props> = ({
  onBlur,
  onFocus,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  color,
  progress = 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  onChange,

  //I have removed required because the rjsf validator will handle it for us
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  required,
  ...props
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [localProgress, setProgress] = useState(progress);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<"success" | "error" | undefined>();
  const [, setLoading] = useState(false);

  useEffect(() => {
    setProgress(progress);
  }, [progress]);

  const handleUpload = async (paramFile?: File) => {
    setLoading(true);
    setResult(undefined);
    setStarted(true);
    try {
      const f = paramFile ?? file;
      if (!f) {
        throw new Error("No file selected");
      }
      const url = await uploadFile(f);
      onChange?.(url);
      setResult("success");
    } catch (error) {
      setResult("error");
      console.error(error);
      toast({
        message: getErrorMessage(error, "Failed to upload file"),
        severity: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={2}>
        <TextField
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
              handleUpload(file);
            }
          }}
          {...{
            ...props,
            onBlur: onBlur as never,
            onFocus: onFocus as never,
          }}
          sx={{
            width: "100%",
          }}
        />

        {/* <Button
          variant="contained"
          color="primary"
          sx={{}}
          onClick={() => {
            handleUpload();
          }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          Upload
        </Button> */}
      </Stack>
      {started && (
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <LinearProgress
            variant="determinate"
            value={localProgress}
            sx={{
              width: "100%",
            }}
            color={result}
          />
          <Typography
            sx={{
              width: "50px",
              textAlign: "center",
            }}
            variant="caption"
            color={result}
          >
            {result === "success" ? (
              <Check fontSize="inherit" color="inherit" />
            ) : (
              `${Math.round(progress)}%`
            )}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default FileUploadTextWidget;
