"use client"
import React, { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";

import { calHourPlay, formatNumber } from "../../app/helper";
import { useTableSessions } from "@/app/query/useTableSession";
import { useProductsSearch } from "../../app/query/useProducts";
import { useAuthStore } from "@/app/store/useUserStore";
import { useControlStore } from "../../app/store/useStore";
import { CATEGORY_LABELS } from "@/form/product";
import { STATUS_SESSION_LABELS } from "@/form/billiardTable";
import { ROLE_ADMIN } from "@/backend/BidaConst";
import { OrderDetail, TableSessionFormSearch } from "@/app/type/model/TableSession";
import Search from "./Search";

interface PropsDetail extends OrderDetail {
  products: any[];
}


const Detail: React.FC<PropsDetail> = ({
  productId,
  products,
  quantity,
  price,
  totalPrice,
}) => {
  const product = products.find((p) => p.id === productId);
  const productName = product ? product.name : "";
  const productImg = product?.image;
  const type = CATEGORY_LABELS[product?.categoryId as keyof typeof CATEGORY_LABELS];

  return (
    <TableRow>
      <TableCell>
        <Grid container alignItems="center" spacing={2}>
          <Grid >
            <Box
              component="img"
              src={productImg}
              alt={productName}
              sx={{ width: 50, height: 50, borderRadius: 1 }}
            />
          </Grid>
          <Grid >
            <Typography variant="body1">{productName}</Typography>
            <Typography variant="caption" color="text.secondary">
              Loại: {type}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>{formatNumber(price)}</TableCell>
      <TableCell>{formatNumber(totalPrice)}</TableCell>
    </TableRow>
  );
};

const Index: React.FC = () => {
  const [formData, setFormData] = useState({
    status: '',
    paymentMethod: '',
    tableId: '',
    employeeId: '',
    codeNo: "",
    dateFrom: "",
    dateTo: "",
    uidLogin:"",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, isError, isPending} = useTableSessions(
    currentPage,
    itemsPerPage,
    formData
  );
  const { data: products, isLoading: isLoadingProduct } = useProductsSearch();
  const user = useAuthStore((state) => state.user);
  const updateStore = useControlStore((state) => state.updateStore);

  if (isLoading || isError || isLoadingProduct) {
    return (
      <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  const totalPages = data.pagination.totalPages;
  const tableSessions = data.data;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: number) => {
    updateStore({
      isVisible: true,
      action: "delete-transaction",
      id,
      title: "Bạn có chắc chắn muốn xóa giao dịch này không?",
    });
  };

  // Giữ nguyên phần Search component như bạn có, giả sử truyền props setFormSearch
  const setFormSearch = (data: TableSessionFormSearch) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 3,background:'#fff' }}>
      {/* Giữ nguyên phần Search component */}
      <Box sx={{  }}>
        <Search isPending={isPending} setFormSearch={setFormSearch} form={formData} />
      </Box>

      {user?.roleId === ROLE_ADMIN && (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ my: 2 }}>
           <Typography variant="h2"  gutterBottom>
          Phiên chơi
        </Typography>
          <Button variant="contained" color="primary" href="/tableSession/create" component={Link}>
            Tạo mới
          </Button>
        </Box>
      )}

      {tableSessions.length === 0 ? (
        <Typography variant="body1">Không có phiên chơi nào.</Typography>
      ) : (
        tableSessions.map((tableSession: any) => (
          <Paper key={tableSession.id} sx={{ mb: 3, p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:8}}>
                <Typography variant="subtitle1" gutterBottom>
                  Mã: {tableSession.codeNo}, Trạng thái:{" "}
                  {STATUS_SESSION_LABELS[tableSession.status]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Người tạo: {tableSession.rUidLogin?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bắt đầu: {dayjs(tableSession.startTime).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thời gian chơi: {calHourPlay(tableSession.playedMinutes)}
                </Typography>
                {tableSession.endTime && (
                  <Typography variant="body2" color="text.secondary">
                    Kết thúc: {dayjs(tableSession.endTime).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                )}
                {tableSession.customer && (
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng: {tableSession.customer.phone}
                  </Typography>
                )}
                {tableSession.amountTable > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Tiền bàn: {formatNumber(tableSession.amountTable)}
                  </Typography>
                )}
              </Grid>
              <Grid
                size={{xs:12, md:4}}
                sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
              >
                <Typography variant="h6">
                  Tổng tiền: {tableSession.totalAmount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            {tableSession.orders.length > 0 && <TableContainer component={Box} sx={{ mt: 2 }}>
              <Table size="small" aria-label="orders detail">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableSession.orders.map((order: any) => (
                    <Detail key={order.id} {...order} products={products || []} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>}

            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                
                // justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              
                <Button variant="outlined" color="primary" href={`/tableSession/update/${tableSession.id}`} component={Link} >
                  Chỉnh sửa
                </Button>
              
              {/* <Button
                variant="outlined"
                color="error"
               
                onClick={() => handleDelete(tableSession.id)}
              >
                Xóa
              </Button> */}
            </Box>
          </Paper>
        ))
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default Index;
