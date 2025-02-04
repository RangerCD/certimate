import { WorkflowOutput, WorkflowRunLog, WorkflowRunLogItem } from "@/domain/workflow";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Check, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "react-i18next";

type WorkflowLogDetailProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log?: WorkflowRunLog;
};
const WorkflowLogDetail = ({ open, onOpenChange, log }: WorkflowLogDetailProps) => {
  const { t } = useTranslation();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-5xl">
        <SheetHeader>
          <SheetTitle>{t("workflow.history.page.title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col">
          {log?.succeed ? (
            <div className="mt-5 flex justify-between bg-green-100 p-5 rounded-md items-center">
              <div className="flex space-x-2 items-center min-w-[150px]">
                <div className="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full text-white">
                  <Check size={18} />
                </div>
                <div className="text-stone-700">{t("workflow.history.props.state.success")}</div>
              </div>

              <div className="text-muted-foreground">{new Date(log.created).toLocaleString()}</div>
            </div>
          ) : (
            <div className="mt-5 flex justify-between bg-red-100 p-5 rounded-md items-center">
              <div className="flex space-x-2 items-center min-w-[150px]">
                <div className="w-8 h-8 bg-red-500 flex items-center justify-center rounded-full text-white">
                  <X size={18} />
                </div>
                <div className="text-stone-700">{t("workflow.history.props.state.failed")}</div>
              </div>

              <div className="text-red-500 max-w-[400px] truncate">{log?.error}</div>

              <div className="text-muted-foreground">{log?.created && new Date(log.created).toLocaleString()}</div>
            </div>
          )}

          <ScrollArea className="h-[80vh] mt-5 bg-black p-5 rounded-md">
            <div className=" text-stone-200 flex flex-col space-y-3">
              {log?.log.map((item: WorkflowRunLogItem, i) => {
                return (
                  <div key={i} className="flex flex-col space-y-2">
                    <div className="">{item.nodeName}</div>
                    <div className="flex flex-col space-y-1">
                      {item.outputs.map((output: WorkflowOutput) => {
                        return (
                          <>
                            <div className="flex text-sm space-x-2">
                              <div>[{output.time}]</div>
                              {output.error ? (
                                <>
                                  <div className="text-red-500 max-w-[70%]">{output.error}</div>
                                </>
                              ) : (
                                <>
                                  <div>{output.content}</div>
                                </>
                              )}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WorkflowLogDetail;
