class SessionsController < ApplicationController
  def new
  end
  def create
  	user = User.find_by_email(params[:email])
  	if user && user.authenticate(params[:password])
  		session[:user_id] = user.id
  		redirect_to root_url, notice: "Logged In as " + user.email
  	else
  		flash.now.alert = "Invalid Email/Password Combination"
  		render "new"
  	end
  end
  def destroy
  	session[:user_id] = nil
  	redirect_to root_url, notice: "Logged Out"
  end

end

