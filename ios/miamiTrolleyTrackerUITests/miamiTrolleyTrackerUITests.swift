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
      let app = XCUIApplication()
      setupSnapshot(app)
      app.launch()
      // require a small sleep so you can properly dismiss the helpClose button
      sleep(2)
      

//      app.otherElements["mainMap"].doubleTap()
//      app.otherElements["mainMap"].doubleTap()
//      app.otherElements["mainMap"].doubleTap()
//      app.otherElements["mainMap"].doubleTap()

      sleep(4)

      let alertNotice = app.alerts["Allow “miamiTrolleyTracker” to access your location while you use the app?"].collectionViews.buttons["Allow"]
      
      if alertNotice.exists {
        alertNotice.tap()
      }
      let helpClose = app.otherElements["helpClose"]
      
      if helpClose.exists {
        helpClose.tap()
      }
//      sleep(2)
      snapshot("01Initial")

//      XCUIApplication().otherElements["mainMap"].childrenMatchingType(.Other).element.childrenMatchingType(.Map).element.tap()

      
      sleep(2)
      app.otherElements["menu-fab"].tap()
      snapshot("02OpenDrawer")
      app.otherElements["DrawerContentRow-1"].switches["0"].tap()
      app.otherElements["DrawerContentRow-2"].switches["0"].tap()
      app.otherElements["DrawerContentRow-3"].switches["0"].tap()
      app.otherElements["DrawerContentRow-4"].switches["0"].tap()

      app.otherElements["DrawerContentRow-6"].switches["0"].tap()

      snapshot("03ToggleRoute")
      let overlay = app.otherElements["rootDrawer"]
      overlay.swipeLeft()
      snapshot("04CloseMap")
      app.otherElements["mainMap"].pinchWithScale(6, velocity: 1)
      app.otherElements["menu-fab"].tap()
      app.otherElements["citibike"].switches["0"].tap()
      overlay.swipeLeft()
      app.otherElements["mainMap"].tap()
      app.otherElements["mainMap"].swipeLeft()
      app.otherElements["mainMap"].tap()
      let map = app.otherElements["mainMap"]
      map.coordinateWithNormalizedOffset(CGVector(dx: 0, dy: 0)).coordinateWithOffset(CGVector(dx: 150, dy: 150)).tap()
//      sleep(5)
//      map.coordinateWithNormalizedOffset(CGVector(dx: 0, dy: 0)).coordinateWithOffset(CGVector(dx: 150, dy: 150)).tap()
//      sleep(5)
//      map.coordinateWithNormalizedOffset(CGVector(dx: 0, dy: 0)).coordinateWithOffset(CGVector(dx: 170, dy: 150)).tap()
//      sleep(5)
//      map.coordinateWithNormalizedOffset(CGVector(dx: 0, dy: 0)).coordinateWithOffset(CGVector(dx: 150, dy: 200)).tap()
      sleep(3)
      snapshot("05RouteInfo")


      
      
    }
    
}
