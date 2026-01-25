-- Allow users to update their own push subscriptions (required for upsert)
CREATE POLICY "Users can update their own subscriptions" 
ON push_subscriptions FOR UPDATE 
USING (auth.uid() = user_id);
