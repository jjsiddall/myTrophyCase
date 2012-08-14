class UsersController < ApplicationController
  def new
  	@user = User.new
  end
  def create
  	@user = User.new(params[:user])
  	if @user.save
      session[:user_id] = @user.id
  		redirect_to user_url(@user.id), notice: "Welcome to My Trophy Case"
  	else
  		render "new"
  	end
  end
  def show
    @user = User.find(params[:id])
  end
end
