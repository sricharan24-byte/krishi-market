const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const isRealSupabaseConfigured = supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('placeholder.supabase.co') &&
    supabaseKey !== 'placeholder';

let supabase;

if (isRealSupabaseConfigured) {
    console.log("⚡ Connecting to Cloud Supabase DB...");
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.log("🌾 Using Self-Contained Local Database Engine with Demo Credentials & Sample Data");

    // Default pre-seeded users
    const defaultPasswordHash = bcrypt.hashSync("Password123", 10);

    const initialUsers = [
        {
            id: "usr_customer_01",
            full_name: "John Customer",
            email: "customer@krishimarket.com",
            phone: "+91 9876543210",
            password: defaultPasswordHash,
            role: "customer",
            address_street: "123 Main St",
            address_city: "Bengaluru",
            address_state: "Karnataka",
            address_zip_code: "560001",
            address_country: "India",
            created_at: new Date().toISOString()
        },
        {
            id: "usr_farmer_01",
            full_name: "Ramesh Farmer",
            email: "farmer@krishimarket.com",
            phone: "+91 9876543211",
            password: defaultPasswordHash,
            role: "farmer",
            address_street: "Green Farmhouse, Village Road",
            address_city: "Nashik",
            address_state: "Maharashtra",
            address_zip_code: "422001",
            address_country: "India",
            created_at: new Date().toISOString()
        },
        {
            id: "usr_admin_01",
            full_name: "Admin User",
            email: "admin@krishimarket.com",
            phone: "+91 9876543212",
            password: defaultPasswordHash,
            role: "admin",
            address_street: "Marketplace HQ",
            address_city: "New Delhi",
            address_state: "Delhi",
            address_zip_code: "110001",
            address_country: "India",
            created_at: new Date().toISOString()
        }
    ];

    const initialProducts = [
        {
            id: "prod_01",
            farmer_id: "usr_farmer_01",
            name: "Fresh Organic Tomatoes",
            description: "Naturally grown farm-fresh red tomatoes, rich in flavor and pesticide-free.",
            category: "Vegetables",
            price: 40,
            unit: "kg",
            quantity: 100,
            is_organic: true,
            images: [],
            ratings: 4.8,
            num_reviews: 12,
            created_at: new Date().toISOString()
        },
        {
            id: "prod_02",
            farmer_id: "usr_farmer_01",
            name: "Premium Basmati Rice",
            description: "Aromatic long-grain basmati rice directly sourced from Punjab fields.",
            category: "Grains",
            price: 120,
            unit: "kg",
            quantity: 500,
            is_organic: false,
            images: [],
            ratings: 4.6,
            num_reviews: 8,
            created_at: new Date().toISOString()
        },
        {
            id: "prod_03",
            farmer_id: "usr_farmer_01",
            name: "Ratnagiri Alphonso Mangoes",
            description: "Sweet, juicy, and authentic Alphonso mangoes fresh from Maharashtra orchards.",
            category: "Fruits",
            price: 600,
            unit: "dozen",
            quantity: 50,
            is_organic: true,
            images: [],
            ratings: 4.9,
            num_reviews: 20,
            created_at: new Date().toISOString()
        }
    ];

    const db = {
        users: [...initialUsers],
        products: [...initialProducts],
        carts: [],
        cart_items: [],
        orders: [],
        order_items: [],
        payments: [],
        reviews: [],
        wishlists: [],
        wishlist_items: [],
        notifications: []
    };

    let idCounter = 100;
    function generateId(prefix = "item") {
        return `${prefix}_${Date.now()}_${++idCounter}`;
    }

    class LocalQueryBuilder {
        constructor(tableName) {
            this.tableName = tableName;
            this._selectFields = null;
            this._action = "select";
            this._filters = [];
            this._orderConfig = null;
            this._insertData = null;
            this._updateData = null;
            this._isSingle = false;
            this._isMaybeSingle = false;
            this._upsertData = null;
        }

        select(fieldsStr = "*") {
            this._selectFields = fieldsStr;
            return this;
        }

        insert(data) {
            this._action = "insert";
            this._insertData = Array.isArray(data) ? data : [data];
            return this;
        }

        update(data) {
            this._action = "update";
            this._updateData = data;
            return this;
        }

        delete() {
            this._action = "delete";
            return this;
        }

        upsert(data) {
            this._action = "upsert";
            this._upsertData = Array.isArray(data) ? data : [data];
            return this;
        }

        eq(column, value) {
            this._filters.push({ type: "eq", column, value });
            return this;
        }

        gte(column, value) {
            this._filters.push({ type: "gte", column, value });
            return this;
        }

        lte(column, value) {
            this._filters.push({ type: "lte", column, value });
            return this;
        }

        ilike(column, pattern) {
            const cleanPattern = (pattern || "").replace(/%/g, "");
            this._filters.push({ type: "ilike", column, value: cleanPattern });
            return this;
        }

        order(column, options = {}) {
            this._orderConfig = { column, ascending: options.ascending !== false };
            return this;
        }

        single() {
            this._isSingle = true;
            return this;
        }

        maybeSingle() {
            this._isMaybeSingle = true;
            return this;
        }

        _applyFilters(rows) {
            let result = [...rows];
            for (const f of this._filters) {
                if (f.type === "eq") {
                    result = result.filter(r => String(r[f.column]) === String(f.value));
                } else if (f.type === "gte") {
                    result = result.filter(r => Number(r[f.column]) >= Number(f.value));
                } else if (f.type === "lte") {
                    result = result.filter(r => Number(r[f.column]) <= Number(f.value));
                } else if (f.type === "ilike") {
                    result = result.filter(r =>
                        String(r[f.column] || "").toLowerCase().includes(String(f.value).toLowerCase())
                    );
                }
            }
            return result;
        }

        _expandRelations(rows) {
            if (!this._selectFields || this._selectFields === "*") return rows;

            const table = this.tableName;
            return rows.map(item => {
                const expanded = { ...item };

                if (table === "products" && this._selectFields.includes("farmer:users")) {
                    const farmer = db.users.find(u => u.id === item.farmer_id);
                    expanded.farmer = farmer ? { full_name: farmer.full_name, email: farmer.email, phone: farmer.phone } : null;
                }

                if (table === "orders") {
                    if (this._selectFields.includes("user:users")) {
                        const user = db.users.find(u => u.id === item.user_id);
                        expanded.user = user ? { id: user.id, full_name: user.full_name, email: user.email } : null;
                    }
                    if (this._selectFields.includes("order_items")) {
                        expanded.order_items = db.order_items.filter(oi => oi.order_id === item.id);
                    }
                }

                if (table === "carts" && this._selectFields.includes("cart_items")) {
                    const items = db.cart_items.filter(ci => ci.cart_id === item.id);
                    expanded.cart_items = items.map(ci => ({
                        ...ci,
                        product: db.products.find(p => p.id === ci.product_id) || null
                    }));
                    expanded.items = expanded.cart_items;
                }

                if (table === "reviews" && this._selectFields.includes("user:users")) {
                    const user = db.users.find(u => u.id === item.user_id);
                    expanded.user = user ? { full_name: user.full_name } : null;
                }

                if (table === "wishlists" && this._selectFields.includes("wishlist_items")) {
                    const items = db.wishlist_items.filter(wi => wi.wishlist_id === item.id);
                    expanded.wishlist_items = items.map(wi => ({
                        ...wi,
                        product: db.products.find(p => p.id === wi.product_id) || null
                    }));
                }

                return expanded;
            });
        }

        async _execute() {
            if (!db[this.tableName]) {
                db[this.tableName] = [];
            }

            let rows = db[this.tableName];

            if (this._action === "insert") {
                const inserted = [];
                for (const row of this._insertData) {
                    const newRow = {
                        id: row.id || generateId(this.tableName.slice(0, 4)),
                        created_at: new Date().toISOString(),
                        ...row
                    };
                    rows.push(newRow);
                    inserted.push(newRow);
                }
                const resultData = this._isSingle || !Array.isArray(this._insertData) ? inserted[0] : inserted;
                return { data: resultData, error: null };
            }

            if (this._action === "upsert") {
                const upserted = [];
                for (const row of this._upsertData) {
                    const existingIdx = rows.findIndex(r =>
                        (row.id && r.id === row.id) ||
                        (row.wishlist_id && row.product_id && r.wishlist_id === row.wishlist_id && r.product_id === row.product_id)
                    );
                    if (existingIdx >= 0) {
                        rows[existingIdx] = { ...rows[existingIdx], ...row };
                        upserted.push(rows[existingIdx]);
                    } else {
                        const newRow = { id: generateId(this.tableName.slice(0, 4)), created_at: new Date().toISOString(), ...row };
                        rows.push(newRow);
                        upserted.push(newRow);
                    }
                }
                return { data: this._isSingle ? upserted[0] : upserted, error: null };
            }

            if (this._action === "update") {
                const targetRows = this._applyFilters(rows);
                for (const r of targetRows) {
                    Object.assign(r, this._updateData);
                }
                return { data: this._isSingle ? targetRows[0] || null : targetRows, error: null };
            }

            if (this._action === "delete") {
                const toDelete = this._applyFilters(rows);
                const deleteIds = new Set(toDelete.map(r => r.id));
                db[this.tableName] = rows.filter(r => !deleteIds.has(r.id));
                return { data: toDelete, error: null };
            }

            // Default: select
            let filtered = this._applyFilters(rows);

            if (this._orderConfig) {
                const { column, ascending } = this._orderConfig;
                filtered.sort((a, b) => {
                    if (a[column] < b[column]) return ascending ? -1 : 1;
                    if (a[column] > b[column]) return ascending ? 1 : -1;
                    return 0;
                });
            }

            let expanded = this._expandRelations(filtered);

            if (this._isSingle || this._isMaybeSingle) {
                return { data: expanded[0] || null, error: null };
            }

            return { data: expanded, error: null };
        }

        then(resolve, reject) {
            return this._execute().then(resolve, reject);
        }
    }

    supabase = {
        from: (tableName) => new LocalQueryBuilder(tableName)
    };
}

module.exports = { supabase };
