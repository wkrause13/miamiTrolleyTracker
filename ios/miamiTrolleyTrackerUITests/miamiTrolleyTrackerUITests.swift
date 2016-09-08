//
//  miamiTrolleyTrackerUITests.swift
//  miamiTrolleyTrackerUITests
//
//  Created by William Krause on 9/7/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import XCTest
import Darwin

class miamiTrolleyTrackerUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
      let app = XCUIApplication()
      setupSnapshot(app)
      app.launch()
      sleep(2)

      
      let alertNotice = app.alerts["Allow “miamiTrolleyTracker” to access your location while you use the app?"].collectionViews.buttons["Allow"]
      
      if alertNotice.exists {
        alertNotice.tap()
      }
      let helpClose = app.otherElements["helpClose"]
      
      if helpClose.exists {
        helpClose.tap()
      }
      snapshot("01Initial")
      app.otherElements["menu-fab"].tap()
      snapshot("02OpenDrawer")
      app.otherElements["DrawerContentRow-1"].tap()
      snapshot("03ToggleRoute")
      app.otherElements["mainMap"].tap()
      snapshot("04CloseMap")
      
      
      
    }
    
}
