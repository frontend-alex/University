import { useFetchData, usePostData } from "@/hooks/useFetch";
import { SubscriptionTier } from "@/types/enums";
import { Invoice } from "@/types/types";

interface ChangePlanPayload {
  tier: SubscriptionTier;
  isAnual: "monthly" | "annual"
}

interface ChangePlanReponse {
  success: boolean;
  url: string;
}
interface GetPricelistsResponse {
  success: boolean;
  message: string;
  invoices: {
    object: string;
    data: Invoice[];
    has_more: boolean;
    url: string;
  };
}

const useSubscribtion = () => {
  const { mutateAsync: changePlan, isPending: isPlanChaning } = usePostData<
    ChangePlanReponse,
    ChangePlanPayload
  >("/stripe/subscribe", {
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const { data: invoices, isPending: isInvoicesFetched } =
    useFetchData<GetPricelistsResponse>(
      ["invoices", "get"],
      "/stripe/get-invoices"
    );

  return {
    changePlan,
    isPlanChaning,

    invoices: invoices?.invoices.data,
    isInvoicesFetched,
  };
};

export default useSubscribtion;
