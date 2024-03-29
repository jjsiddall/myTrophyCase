class RacesController < ApplicationController
  # GET /races
  # GET /races.json
  def search
    @allRaceData = Race.find(:all, :order => :race_name)
    # @races = Race.find(:all, :group => :race_name).collect { |r| r.race_name }
    @races = Race.all.map { |r| r.race_name }.uniq

    # @race_names_hash = Race.all.group_by { |r| r.race_name }

    respond_to do |format|
      format.html # search.html.erb
      format.json { render json: @races }
    end
  end
  def index
    @races = Race.find(:all, :order => :race_name)
    @race = Race.new

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @races }
    end
    
  end

  # GET /races/1
  # GET /races/1.json
  def show
    @race = Race.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @race }
    end
  end

  # GET /races/new
  # GET /races/new.json
  def new
    @race = Race.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @race }
    end
  end

  # GET /races/1/edit
  def edit
    @race = Race.find(params[:id])

    respond_to do |format|
      format.js
      format.html
    end
  end

  # POST /races
  # POST /races.json
  def create
    @race = Race.new(params[:race])

    respond_to do |format|
      if @race.save
        format.js
        format.html { redirect_to races_url, notice: 'Race was successfully created.' }
        format.json { render json: @race, status: :created, location: @race }
      else
        format.html { render action: "new" }
        format.json { render json: @race.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /races/1
  # PUT /races/1.json
  def update
    @race = Race.find(params[:id])

    respond_to do |format|
      if @race.update_attributes(params[:race])
        format.js
        format.html { redirect_to @race, notice: 'Race was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @race.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /races/1
  # DELETE /races/1.json
  def destroy
    @race = Race.find(params[:id])
    @race.destroy

    respond_to do |format|
      format.js
      format.html { redirect_to races_url }
      format.json { head :no_content }
    end
  end
end
