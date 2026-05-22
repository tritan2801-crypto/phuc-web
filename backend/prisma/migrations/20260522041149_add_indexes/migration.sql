-- CreateIndex
CREATE INDEX "heavy_shipping_rules_warehouseId_idx" ON "heavy_shipping_rules"("warehouseId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_customerId_idx" ON "invoices"("customerId");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_subCategory_idx" ON "products"("subCategory");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
