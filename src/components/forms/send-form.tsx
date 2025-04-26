import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidSolanaAddress } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define the form schema with validation
const sendFormSchema = z.object({
  recipientAddress: z
    .string()
    .trim()
    .min(1, { message: "Recipient address is required" })
    .refine((val) => val.length === 0 || isValidSolanaAddress(val), {
      message: "Please enter a valid Solana address",
    }),
  amount: z
    .string()
    .trim()
    .min(1, { message: "Amount is required" })
    .refine((val) => val.length === 0 || !isNaN(Number(val)), {
      message: "Amount must be a number",
    })
    .refine((val) => val.length === 0 || Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
});

export type SendFormValues = z.infer<typeof sendFormSchema>;

type SendFormProps = {
  onSubmit: (data: SendFormValues) => void;
  isSubmitting: boolean;
};

export function SendForm({ onSubmit, isSubmitting }: SendFormProps) {
  const form = useForm<SendFormValues>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      recipientAddress: "",
      amount: "",
    },
    mode: "onChange",
  });

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <div className="p-4 pb-2">
              <FormField
                control={form.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-sm font-medium mb-1.5">
                      Recipient Address
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="Enter Solana wallet address"
                          {...field}
                          disabled={isSubmitting}
                          className={cn(
                            "rounded-r-none h-10 border-slate-200 dark:border-slate-800",
                            form.formState.errors.recipientAddress &&
                              "border-destructive"
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-l-none border-l-0 h-10 w-10 border-slate-200 dark:border-slate-800"
                          onClick={() => {
                            navigator.clipboard.readText().then((text) => {
                              form.setValue("recipientAddress", text);
                              form.trigger("recipientAddress");
                            });
                          }}
                          disabled={isSubmitting}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <div className="h-5 mt-1">
                      {form.formState.errors.recipientAddress ? (
                        <FormMessage className="text-xs" />
                      ) : (
                        <FormDescription className="text-xs text-muted-foreground">
                          The Solana wallet address of the recipient
                        </FormDescription>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="mb-0">
                    <FormLabel className="text-sm font-medium mb-1.5">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">$</span>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          className={cn(
                            "pl-7 h-10 border-slate-200 dark:border-slate-800",
                            form.formState.errors.amount && "border-destructive"
                          )}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <div className="h-5 mt-1">
                      {form.formState.errors.amount ? (
                        <FormMessage className="text-xs" />
                      ) : (
                        <FormDescription className="text-xs text-muted-foreground">
                          Amount in USD to send
                        </FormDescription>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Form validation status */}
            <div className="px-4">
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="rounded-md bg-destructive/15 py-1.5 px-3 text-xs text-destructive mb-2">
                  Please fix the errors above before submitting
                </div>
              )}
            </div>

            <div className="mt-2 flex justify-center px-4">
              <Button
                type="submit"
                variant="default"
                className=" py-2 h-[42px] rounded-b-lg font-medium text-sm w-full mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Payment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
