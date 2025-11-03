import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import styles from './App.module.css'; // ⬅️ Updated
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecipeList = lazy(() => import('./pages/RecipeList'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const EditRecipe = lazy(() => import('./pages/EditRecipe'));
const Profile = lazy(() => import('./pages/Profile'));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage'));
const EditMealPlanPage = lazy(() => import('./pages/EditMealPlanPage'));
const DailyStatsPage = lazy(() => import('./pages/DailyStatsPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MealPlanPage = lazy(() => import('./pages/MealPlanPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminRecipes = lazy(() => import('./pages/AdminRecipes'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

const Loading = () => <div className={styles.suspenseLoading}>Loading...</div>;

function App() {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    NProgress.start();
    if (!loading) setIsAppReady(true);
    return () => NProgress.done();
  }, [loading]);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <Navbar />
      </header>

      <main className={styles.mainContent}>
        {isAppReady ? (
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  !isAuthenticated ? (
                    <HomePage />
                  ) : (
                    <Navigate to={`/${user.role === 'admin' ? 'admin/dashboard' : 'dashboard'}`} />
                  )
                }
              />
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

              {/* User Protected */}
              <Route element={<ProtectedRoute roles={['user']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recipes" element={<RecipeList />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/recipes/edit/:id" element={<EditRecipe />} />
                <Route path="/mealplanner" element={<MealPlanPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/edit-meal/:id" element={<EditMealPlanPage />} />
                <Route path="/daily-stats" element={<DailyStatsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>

              {/* Admin Protected */}
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="recipes" element={<AdminRecipes />} />
                  <Route path="recipes/add" element={<AddRecipe />} />
                  <Route path="recipes/edit/:id" element={<EditRecipe />} />
                  <Route path="recipes/:id" element={<RecipeDetailPage />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        ) : (
          <Loading />
        )}
      </main>
    </div>
  );
}

export default App;
