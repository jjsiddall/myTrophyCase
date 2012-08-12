class UpdateUserTableWithPasswordDigest < ActiveRecord::Migration
  def up
  	remove_column :users, :password_hash
    rename_column :users, :password_salt, :password_digest
  end

  def down
  	add_column :users, :password_hash
    rename_column :users, :password_digest, :password_salt
  end
end
