MyTrophyCase::Application.routes.draw do
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  root :to => "sessions#new"
  
  resources :sessions
  
  resources :users do
  	resources :results
  end

end
