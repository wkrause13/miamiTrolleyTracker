package com.miamitrolleytracker;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;


import tools.fastlane.screengrab.Screengrab;
import tools.fastlane.screengrab.UiAutomatorScreenshotStrategy;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.support.test.InstrumentationRegistry;
import android.support.test.filters.SdkSuppress;
import android.support.test.uiautomator.By;
import android.support.test.uiautomator.UiDevice;
import android.support.test.uiautomator.UiObject;
import android.support.test.uiautomator.UiObjectNotFoundException;
import android.support.test.uiautomator.UiSelector;
import android.support.test.uiautomator.Until;

import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(JUnit4.class)
@SdkSuppress(minSdkVersion = 16)
public class JUnit4StyleTests {

    private static final String BASIC_SAMPLE_PACKAGE
            = "com.miamitrolleytracker";

    private static final int LAUNCH_TIMEOUT = 5000;

    private static final String STRING_TO_BE_TYPED = "UiAutomator";

    private UiDevice mDevice;

    @Before
    public void startMainActivityFromHomeScreen() {
        // Initialize UiDevice instance
        mDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

        // Start from the home screen
        mDevice.pressHome();

        // Wait for launcher
        final String launcherPackage = getLauncherPackageName();
        assertThat(launcherPackage, notNullValue());
        mDevice.wait(Until.hasObject(By.pkg(launcherPackage).depth(0)), LAUNCH_TIMEOUT);

        // Launch the blueprint app
        Context context = InstrumentationRegistry.getContext();
        final Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(BASIC_SAMPLE_PACKAGE);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);    // Clear out any previous instances
        context.startActivity(intent);

        // Wait for the app to appear
        mDevice.wait(Until.hasObject(By.pkg(BASIC_SAMPLE_PACKAGE).depth(0)), LAUNCH_TIMEOUT);
    }

    @Test
    public void testChangeText_sameActivity() throws UiObjectNotFoundException, InterruptedException {

        Screengrab.setDefaultScreenshotStrategy(new UiAutomatorScreenshotStrategy());
        // Type text and then press the button.
        Thread.sleep(7000);
        Screengrab.screenshot("before_button_click");
        UiObject menuButton = mDevice.findObject(new UiSelector().description("menu-fab"));
        menuButton.click();

        mDevice.findObject(new UiSelector().description("DrawerContentRow-1")).click();
        Thread.sleep(1000);
        mDevice.swipe(310, 300, 0, 300, 5);

        Thread.sleep(4000);
        Screengrab.screenshot("after_button_click");
    }

    @Test
    public void testShowPreferences() throws UiObjectNotFoundException, InterruptedException {

        Screengrab.setDefaultScreenshotStrategy(new UiAutomatorScreenshotStrategy());
        // Type text and then press the button.
        Thread.sleep(7000);
        UiObject menuButton = mDevice.findObject(new UiSelector().description("menu-fab"));
        menuButton.click();
        Thread.sleep(1000);
        UiObject settingsIcon = mDevice.findObject(new UiSelector().description("settingsIcon"));
        settingsIcon.click();

        Thread.sleep(2000);
        Screengrab.screenshot("preferences");
    }


    /**
     * Uses package manager to find the package name of the device launcher. Usually this package
     * is "com.android.launcher" but can be different at times. This is a generic solution which
     * works on all platforms.`
     */
    private String getLauncherPackageName() {
        // Create launcher Intent
        final Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);

        // Use PackageManager to get the launcher package name
        PackageManager pm = InstrumentationRegistry.getContext().getPackageManager();
        ResolveInfo resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
        return resolveInfo.activityInfo.packageName;
    }
}