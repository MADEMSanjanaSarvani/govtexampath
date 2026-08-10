# Capacitor / WebView
-keep class com.getcapacitor.** { *; }
-keep class com.govtexampath.app.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Keep line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# @capacitor-firebase/authentication's FacebookAuthProviderHandler is compiled
# in unconditionally, but its Facebook SDK dependency is only pulled in as
# `implementation` when rgcfaIncludeFacebook=true (android/variables.gradle
# only sets rgcfaIncludeGoogle=true — we don't use Facebook sign-in). The
# handler class exists but is never instantiated at runtime since we never
# select the Facebook provider, so R8 just needs to stop treating its
# unresolved Facebook SDK references as a hard build failure.
-dontwarn com.facebook.**
