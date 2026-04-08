import supabase from "../config/supabase";

const signUp = async (name, email, contact, password, userType) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (authError) throw authError;


    const { error } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        email: email,
        name: userType === "regular" ? name : null,
        shopname: userType === "shopOwner" ? name : null,
        contact: userType === "shopOwner" ? contact : null,
        role: userType,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
  } catch (error) {
  }
};

const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (dbError) throw dbError;

    return profile;
  } catch (error) {
  }
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
  } else {
  }
};

export { signUp, signIn, logout };
