import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { fetchReportSummaryLast7Days } from '../api/apiReport';


export const useReportRevenueWeek = () => {
  return useQuery({
    queryKey:['revenue-week'],
    queryFn: fetchReportSummaryLast7Days,
    staleTime:1000*6,
    refetchOnWindowFocus: false, // ✅ KHÔNG refetch khi quay lại tab
  })
};

