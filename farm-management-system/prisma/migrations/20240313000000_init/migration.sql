-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "pinned" BOOLEAN DEFAULT false,
    "watched" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schema" JSONB,
    "document_type" TEXT,
    "custom_tags" TEXT,
    "related_docs" TEXT,
    "industry_metadata" JSONB,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sections" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "section_title" TEXT,
    "content" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "document_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_rows" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "row_data" JSONB NOT NULL,

    CONSTRAINT "document_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_relationships" (
    "id" SERIAL NOT NULL,
    "source_doc_id" INTEGER NOT NULL,
    "target_doc_id" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "document_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "size" DOUBLE PRECISION,
    "soil_type" TEXT,
    "crop_history" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_crops" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "planting_date" TIMESTAMP(3),
    "harvest_date" TIMESTAMP(3),
    "field_id" INTEGER,
    "status" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_crops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm_equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "purchase_date" TIMESTAMP(3),
    "status" TEXT,
    "maintenance" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farm_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_docId_key" ON "documents"("docId");

-- AddForeignKey
ALTER TABLE "document_sections" ADD CONSTRAINT "document_sections_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_rows" ADD CONSTRAINT "document_rows_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_relationships" ADD CONSTRAINT "document_relationships_source_doc_id_fkey" FOREIGN KEY ("source_doc_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_relationships" ADD CONSTRAINT "document_relationships_target_doc_id_fkey" FOREIGN KEY ("target_doc_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE; 