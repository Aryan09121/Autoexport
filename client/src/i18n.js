import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: {
					dashboard: {
						title: "Dashboard",
						hello: "Hello",
						invoices: "Invoices",
						greeting: "Hello, {{name}}",
						admin: "Admin",
						action: "Action",
						summary: "Your current Invoice summary and activity.",
						createInvoice: "Create Invoice",
						totalInvoices: "Total Invoices",
						completedInvoices: "Completed Invoices",
						totalProducts: "Total Products",
						recentProducts: "Recent Products",
						loading: "Loading...",
						// Add translations for DashboardTable component
						recentInvoices: "Recent Invoices",
						invoiceId: "Invoice ID",
						customerName: "Customer Name",
						date: "Date",
						amount: "Amount",
						status: "Status",
						paid: "Paid",
						unpaid: "Unpaid",
						view: "View",
						noInvoices: "No recent invoices found.",
						greet: "Your current Invoice summary and activity.",
						// Add any other static text that might be in your DashboardTable component
					},
					// Add other sections of your app here
				},
			},
			ar: {
				translation: {
					dashboard: {
						greet: "ملخص الفاتورة الحالية والنشاط.",
						title: "لوحة التحكم",
						hello: "مرحبًا",
						invoices: "فاتورة",
						action: "فعل",
						greeting: "مرحبًا، {{name}}",
						admin: "المشرف",
						summary: "ملخص الفواتير الحالية والنشاط الخاص بك.",
						createInvoice: "إنشاء فاتورة",
						totalInvoices: "إجمالي الفواتير",
						completedInvoices: "الفواتير المكتملة",
						totalProducts: "إجمالي المنتجات",
						recentProducts: "المنتجات الحديثة",
						loading: "جارٍ التحميل...",
						// Add translations for DashboardTable component
						recentInvoices: "الفواتير الحديثة",
						invoiceId: "رقم الفاتورة",
						customerName: "اسم العميل",
						date: "التاريخ",
						amount: "المبلغ",
						status: "الحالة",
						paid: "مدفوع",
						unpaid: "غير مدفوع",
						view: "عرض",
						noInvoices: "لم يتم العثور على فواتير حديثة.",
						// Add any other static text that might be in your DashboardTable component
					},
					// Add other sections of your app here
				},
			},
		},
	});

export default i18n;
