export interface Order {
  id: number;
  name: string;          // Customer's name
  address: string;       // Customer's address
  phone: string;         // Customer's phone number
  email: string;         // Customer's email
  product_id: number;    // ID of the ordered product
  quantity: number;      // Quantity of the product ordered
  total_price: number;   // Total price for the order
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';  // Order status
  created_at: Date;      // Timestamp of when the order was created
  updated_at: Date;      // Timestamp of when the order was last updated
}
