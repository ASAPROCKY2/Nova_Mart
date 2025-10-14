CREATE TYPE "public"."delivery_method" AS ENUM('pickup', 'delivery');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"delivery_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"driver_name" varchar(100),
	"driver_phone" varchar(20),
	"delivery_status" "order_status" DEFAULT 'pending',
	"delivery_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"order_status" "order_status" DEFAULT 'pending',
	"payment_status" "payment_status" DEFAULT 'pending',
	"delivery_method" "delivery_method" DEFAULT 'delivery',
	"delivery_address" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" varchar(100),
	"payment_method" varchar(50),
	"payment_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"image_url" varchar(255),
	"category_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(50) NOT NULL,
	"lastname" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"contact_phone" varchar(20),
	"address" varchar(255),
	"city" varchar(100),
	"role" "role" DEFAULT 'user',
	"isVerified" boolean DEFAULT false,
	"image_url" varchar(255) DEFAULT 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;